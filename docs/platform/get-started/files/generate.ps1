$p = $PSScriptRoot; if ("" -eq $p) { $p = (Get-Location) };
$s = [System.Guid]::NewGuid()

Write-Host "Generated password: $s" -ForegroundColor DarkGreen
Set-Content $p -Path $p/generated-secret.txt -NoNewline | Out-Null

Write-Host "Generating CA Key" -ForegroundColor DarkGreen
docker run --rm -t -it -v "$($p):/data:rw" alpine/openssl `
    genrsa `
    -des3  `
    -out /data/generated-ca.key `
    -passout pass:$s `
    2048
if ($LASTEXITCODE -ne 0) { return; }

Write-Host "Generating CA cert" -ForegroundColor DarkGreen
docker run --rm -t -it -v "$($p):/data:rw" alpine/openssl `
    req `
    -x509 `
    -new `
    -nodes `
    -key /data/generated-ca.key `
    -sha256 `
    -days 3650 `
    -out /data/generated-ca.pem `
    -subj "/CN=Dev CA" `
    -config /data/ca.txt `
    -passin pass:$s 
if ($LASTEXITCODE -ne 0) { return; }

if ($DebugPreference -eq "Continue") {
    Write-Host "Display CA cert" -ForegroundColor DarkGreen
    docker run --rm -t -it -v "$($p):/data:rw" alpine/openssl `
        x509 -text -noout -in /data/generated-ca.pem
    if ($LASTEXITCODE -ne 0) { return; }
}

Write-Host "Generating dev key" -ForegroundColor DarkGreen
docker run --rm -t -it -v "$($p):/data:rw" alpine/openssl `
    genrsa `
    -out /data/generated-localhost.key `
    -passout pass:$s `
    2048
if ($LASTEXITCODE -ne 0) { return; }

Write-Host "Generating dev cert" -ForegroundColor DarkGreen
docker run --rm -t -it -v "$($p):/data:rw" alpine/openssl `
    req `
    -new `
    -key /data/generated-localhost.key `
    -out /data/generated-localhost.csr `
    -config /data/localhost.txt `
    -subj "/CN=localhost"
if ($LASTEXITCODE -ne 0) { return; }

if ($DebugPreference -eq "Continue") {
    Write-Host "Display dev csr" -ForegroundColor DarkGreen
    docker run --rm -t -it -v "$($p):/data:rw" alpine/openssl `
        req -text -noout -verify -in /data/generated-localhost.csr
    if ($LASTEXITCODE -ne 0) { return; }
}

Write-Host "Signing dev cert" -ForegroundColor DarkGreen
docker run --rm -t -it -v "$($p):/data:rw" alpine/openssl `
    x509 `
    -req `
    -days 3650 `
    -CA /data/generated-ca.pem `
    -CAkey /data/generated-ca.key `
    -CAcreateserial `
    -in  /data/generated-localhost.csr `
    -out /data/generated-localhost.crt `
    -extensions user_crt `
    -extfile /data/localhost.txt `
    -passin pass:$s
if ($LASTEXITCODE -ne 0) { return; }

if ($DebugPreference -eq "Continue") {
    Write-Host "Display dev cert" -ForegroundColor DarkGreen
    docker run --rm -t -it -v "$($p):/data:rw" alpine/openssl `
        x509 -text -noout -in /data/generated-localhost.crt
    if ($LASTEXITCODE -ne 0) { return; }
}

Write-Host "Exporting dev cert" -ForegroundColor DarkGreen
docker run --rm -t -it -v "$($p):/data:rw" alpine/openssl `
    pkcs12 -export `
    -out /data/generated-localhost.pfx `
    -inkey /data/generated-localhost.key `
    -in /data/generated-localhost.crt `
    -name "ASP.NET Core HTTPS development certificate" `
    -passout pass:$s
if ($LASTEXITCODE -ne 0) { return; }

if ($DebugPreference -eq "Continue") {
    Write-Host "Display dev pfx" -ForegroundColor DarkGreen
    docker run --rm -t -it -v "$($p):/data:rw" alpine/openssl `
        pkcs12 -info -in /data/generated-localhost.pfx -passin pass:$s -nokeys -nocerts
    if ($LASTEXITCODE -ne 0) { return; }
}
    
if ($env:Os -eq "Windows_NT" -or $IsWindows) {
    $r = (Read-Host -Prompt "Install as dev cert? [Y/n]")
    if ("" -eq $r -or "y" -eq $r -or "Y" -eq $r) {
        $sp = (ConvertTo-SecureString $s -AsPlainText -Force)

        Import-Certificate `
            -FilePath $p/generated-ca.pem `
            -CertStoreLocation cert:\CurrentUser\Root
        if ($LASTEXITCODE -ne 0) { return; }

        Import-PfxCertificate `
            -FilePath $p/generated-localhost.pfx `
            -Password $sp `
            -Exportable `
            -CertStoreLocation cert:\CurrentUser\My
        if ($LASTEXITCODE -ne 0) { return; }

        dotnet dev-certs https --trust
        if ($LASTEXITCODE -ne 0) { return; }

        if (Test-Path "$Env:APPDATA\ASP.NET\Https") {
            Remove-Item "$Env:APPDATA\ASP.NET\Https\*"
            if ($LASTEXITCODE -ne 0) { return; }
        }

        $myWindowsID = [System.Security.Principal.WindowsIdentity]::GetCurrent();
        $myWindowsPrincipal = New-Object System.Security.Principal.WindowsPrincipal($myWindowsID);
        $adminRole = [System.Security.Principal.WindowsBuiltInRole]::Administrator;
        if ($myWindowsPrincipal.IsInRole($adminRole)) {
            $r = (Read-Host -Prompt "Install machine wide to be used with IIS? [Y/n]")
            if ("" -eq $r -or "y" -eq $r -or "Y" -eq $r) {
                $sp = (ConvertTo-SecureString $s -AsPlainText -Force)
                Import-Certificate `
                    -FilePath ./generated-ca.pem `
                    -CertStoreLocation cert:\LocalMachine\Root
                if ($LASTEXITCODE -ne 0) { return; }

                Import-PfxCertificate `
                    -FilePath ./generated-localhost.pfx `
                    -Password $sp `
                    -CertStoreLocation cert:\LocalMachine\My
                if ($LASTEXITCODE -ne 0) { return; }
            }
        }
    }
    Remove-Item -Path "$($p)/generated-*" -Recurse -Force | Out-Null
}
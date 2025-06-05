# Check Visual Studio Build Tools Installation
# This script checks if the required build tools are installed

Write-Host "Checking Visual Studio Build Tools Installation..." -ForegroundColor Green

# Function to check if path exists
function Test-Path-Exists($path) {
    return Test-Path $path
}

# Function to check registry for VS installations
function Get-VSInstallations {
    try {
        $vsWhere = "${env:ProgramFiles(x86)}\Microsoft Visual Studio\Installer\vswhere.exe"
        if (Test-Path $vsWhere) {
            $installations = & $vsWhere -products * -requires Microsoft.VisualStudio.Component.VC.Tools.x86.x64 -property installationPath
            return $installations
        }
    }
    catch {
        return $null
    }
    return $null
}

# Check for Visual Studio installations
Write-Host "`nChecking for Visual Studio installations..." -ForegroundColor Blue

$vsInstallations = Get-VSInstallations
if ($vsInstallations) {
    Write-Host "[OK] Found Visual Studio installation(s):" -ForegroundColor Green
    foreach ($installation in $vsInstallations) {
        Write-Host "   $installation" -ForegroundColor Cyan
    }
}
else {
    Write-Host "[WARNING] No Visual Studio installations with C++ tools found" -ForegroundColor Yellow
}

# Check for common build tool paths
Write-Host "`nChecking for build tools..." -ForegroundColor Blue

$buildToolPaths = @(
    "${env:ProgramFiles(x86)}\Microsoft Visual Studio\2022\BuildTools\VC\Tools\MSVC",
    "${env:ProgramFiles(x86)}\Microsoft Visual Studio\2019\BuildTools\VC\Tools\MSVC",
    "${env:ProgramFiles}\Microsoft Visual Studio\2022\Community\VC\Tools\MSVC",
    "${env:ProgramFiles}\Microsoft Visual Studio\2022\Professional\VC\Tools\MSVC",
    "${env:ProgramFiles}\Microsoft Visual Studio\2022\Enterprise\VC\Tools\MSVC"
)

$foundBuildTools = $false
foreach ($path in $buildToolPaths) {
    if (Test-Path $path) {
        Write-Host "[OK] Found build tools at: $path" -ForegroundColor Green
        $foundBuildTools = $true
        
        # Look for specific tools
        $subDirs = Get-ChildItem $path -Directory | Sort-Object Name -Descending | Select-Object -First 1
        if ($subDirs) {
            $toolsPath = Join-Path $subDirs.FullName "bin\Hostx64\x64"
            if (Test-Path (Join-Path $toolsPath "link.exe")) {
                Write-Host "[OK] Found linker (link.exe) at: $toolsPath" -ForegroundColor Green
            }
            if (Test-Path (Join-Path $toolsPath "cl.exe")) {
                Write-Host "[OK] Found compiler (cl.exe) at: $toolsPath" -ForegroundColor Green
            }
        }
    }
}

if (-not $foundBuildTools) {
    Write-Host "[ERROR] No Visual Studio Build Tools found" -ForegroundColor Red
}

# Check Windows SDK
Write-Host "`nChecking for Windows SDK..." -ForegroundColor Blue
$sdkPaths = @(
    "${env:ProgramFiles(x86)}\Windows Kits\10\bin",
    "${env:ProgramFiles}\Windows Kits\10\bin"
)

$foundSDK = $false
foreach ($path in $sdkPaths) {
    if (Test-Path $path) {
        Write-Host "[OK] Found Windows SDK at: $path" -ForegroundColor Green
        $foundSDK = $true
        break
    }
}

if (-not $foundSDK) {
    Write-Host "[WARNING] Windows SDK not found" -ForegroundColor Yellow
}

# Check if Rust can find the linker
Write-Host "`nTesting Rust compilation..." -ForegroundColor Blue
try {
    # Try to compile a simple Rust program
    $tempDir = Join-Path $env:TEMP "rust_test_$(Get-Random)"
    New-Item -ItemType Directory -Path $tempDir -Force | Out-Null
    
    $cargoToml = @"
[package]
name = "test"
version = "0.1.0"
edition = "2021"
"@
    
    $mainRs = @"
fn main() {
    println!("Hello, world!");
}
"@
    
    Set-Content -Path (Join-Path $tempDir "Cargo.toml") -Value $cargoToml
    New-Item -ItemType Directory -Path (Join-Path $tempDir "src") -Force | Out-Null
    Set-Content -Path (Join-Path $tempDir "src\main.rs") -Value $mainRs
    
    Push-Location $tempDir
    $compileResult = cargo build 2>&1
    Pop-Location
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "[OK] Rust compilation test successful" -ForegroundColor Green
    }
    else {
        Write-Host "[ERROR] Rust compilation test failed:" -ForegroundColor Red
        Write-Host $compileResult -ForegroundColor Red
    }
    
    # Clean up
    Remove-Item -Recurse -Force $tempDir -ErrorAction SilentlyContinue
}
catch {
    Write-Host "[ERROR] Could not test Rust compilation" -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}

# Summary and recommendations
Write-Host "`n" + "="*60 -ForegroundColor White
Write-Host "SUMMARY AND RECOMMENDATIONS" -ForegroundColor White
Write-Host "="*60 -ForegroundColor White

if ($foundBuildTools) {
    Write-Host "[READY] Visual Studio Build Tools appear to be installed" -ForegroundColor Green
    Write-Host "You should be able to run the deployment script:" -ForegroundColor Green
    Write-Host "   .\deploy-contract-simple.ps1" -ForegroundColor Cyan
}
else {
    Write-Host "[ACTION REQUIRED] Visual Studio Build Tools need to be installed" -ForegroundColor Red
    Write-Host "`nTo install Visual Studio Build Tools:" -ForegroundColor Yellow
    Write-Host "1. Download from: https://visualstudio.microsoft.com/downloads/" -ForegroundColor White
    Write-Host "2. Look for 'Build Tools for Visual Studio 2022'" -ForegroundColor White
    Write-Host "3. During installation, select:" -ForegroundColor White
    Write-Host "   - C++ build tools" -ForegroundColor Cyan
    Write-Host "   - Windows 10/11 SDK" -ForegroundColor Cyan
    Write-Host "   - MSVC v143 compiler toolset" -ForegroundColor Cyan
    Write-Host "4. After installation, restart your terminal and try again" -ForegroundColor White
}

Write-Host "`nAlternative: Use Visual Studio Installer" -ForegroundColor Yellow
Write-Host "If you have Visual Studio installed, open Visual Studio Installer and:" -ForegroundColor White
Write-Host "1. Modify your installation" -ForegroundColor White
Write-Host "2. Add 'Desktop development with C++' workload" -ForegroundColor White
Write-Host "3. Ensure 'MSVC v143 C++ x64 build tools' is selected" -ForegroundColor White

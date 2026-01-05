# Generate files.json manifests for folders (PowerShell)
param(
  [string[]] $Folders = @('Data','Documents')
)

foreach ($f in $Folders) {
  $dir = Join-Path -Path (Get-Location) -ChildPath $f
  if (-Not (Test-Path $dir)) {
    Write-Error "Folder not found: $f"
    continue
  }

  $items = Get-ChildItem -File -Path $dir | Where-Object { $_.Name -ne 'files.json' } | ForEach-Object {
    [PSCustomObject]@{
      name = $_.Name
      url  = "$f/$($_.Name)"
    }
  }

  $json = $items | ConvertTo-Json -Depth 4
  $json | Out-File -Encoding utf8 -FilePath (Join-Path $dir 'files.json')
  Write-Host "Wrote $($items.Count) items to $f\files.json"
}
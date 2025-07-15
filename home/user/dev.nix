{pkgs}: {
  packages = [
    pkgs.nodejs_20,
    pkgs.openssh,
    pkgs.git-filter-repo,
    pkgs.gcloud
  ];
}

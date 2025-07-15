{ pkgs, ... }: {
  packages = [
    pkgs.openssh
    pkgs.git-filter-repo
  ];
}

{ pkgs, ... }: {
  # Add the packages you want to use in your environment
  packages = [
    pkgs.nodejs_20
    pkgs.openssh
    pkgs.git-filter-repo
  ];
  pre-commit.hooks = {
    # You can add pre-commit hooks here
  };
}

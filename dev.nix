{ pkgs, ... }: {
  # To learn more about flakes and dev environments, visit https://nix.dev/
  packages = [
    # For Next.js development
    pkgs.nodejs_20
    # For using git with SSH authentication
    pkgs.openssh
  ];
  preCommit.tools = {
    prettier = {
      enable = true;
      package = pkgs.nodePackages.prettier;
    };
  };
}

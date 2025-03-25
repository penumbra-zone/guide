# in flake.nix
{
  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };
  outputs = { self, nixpkgs, flake-utils }:
    flake-utils.lib.eachDefaultSystem
      (system:
        let
          pkgs = import nixpkgs {
            inherit system ;
          };
        in
        with pkgs;
        {
          devShells.default = mkShell {
            buildInputs = [ 
                fd
                firebase-tools
                just
                markdown-link-check
                nodejs_20
                pnpm
            ];
          };
        }
      );
}

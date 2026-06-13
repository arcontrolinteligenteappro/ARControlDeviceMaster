{ pkgs, ... }: {
  channel = "stable-23.11"; # Canal de estabilidad de Google
  
  packages = [
    pkgs.nodejs_20
    pkgs.git
    pkgs.xvfb-run   # Servidor de display virtual para evitar crashes de UI en la nube
    # --- DEPENDENCIAS NATIVAS DE ELECTRON ---
    pkgs.glib       # Aquí va el famoso libgobject
    pkgs.nss
    pkgs.nspr
    pkgs.dbus
    pkgs.atk
    pkgs.cups
    pkgs.libdrm
    pkgs.alsa-lib
    pkgs.mesa
    pkgs.xorg.libX11
    pkgs.xorg.libXcomposite
    pkgs.xorg.libXdamage
    pkgs.xorg.libXext
    pkgs.xorg.libXfixes
    pkgs.xorg.libXrandr
    pkgs.xorg.libxcb
    pkgs.wine
  ];

  env = {};

  idx = {
    extensions = [
      "dbaeumer.vscode-eslint"
      "esbenp.prettier-vscode"
    ];
    workspace = {
      onCreate = {
        npm-install = "npm install";
      };
    };
  };
}
export class V86Manager {
    private emulator: any;
    private onReady: () => void;

    constructor(onReady: () => void) {
        this.onReady = onReady;
    }

    async boot() {
        if (this.emulator) return;

        // V86 configuration optimized for mobile & headless
        this.emulator = new (window as any).V86Starter({
            wasm_path: "https://copy.sh/v86/v86.wasm",
            memory_size: 256 * 1024 * 1024, // 256MB
            vga_memory_size: 2 * 1024 * 1024,
            network_relay_url: "wss://relay.widgetry.org/", 
            bios: { url: "https://copy.sh/v86/bios/seabios.bin" },
            vga_bios: { url: "https://copy.sh/v86/bios/vgabios.bin" },
            cdrom: { url: "https://copy.sh/v86/images/linux.iso" }, // Minimal boot image
            autostart: true,
            disable_keyboard: true,
            disable_mouse: true,
        });

        this.emulator.add_listener("serial0-output", (char: string) => {
            if (char === "#" || char === "$") {
                this.onReady();
            }
        });
    }

    async exec(command: string): Promise<string> {
        return new Promise((resolve) => {
            let output = "";
            const listener = (char: string) => {
                output += char;
                if (char === "#") {
                    this.emulator.remove_listener("serial0-output", listener);
                    resolve(output.trim());
                }
            };
            this.emulator.add_listener("serial0-output", listener);
            this.emulator.serial0_send(command + "\n");
        });
    }

    async readFile(path: string): Promise<string> {
        return this.exec(`cat ${path}`);
    }

    async writeFile(path: string, data: string): Promise<void> {
        const base64 = btoa(data);
        await this.exec(`echo "${base64}" | base64 -d > ${path}`);
    }
}
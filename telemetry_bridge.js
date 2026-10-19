// Native macOS Telemetry Bridge Engine - Extended Enterprise Version
// Executed via: osascript -l JavaScript telemetry_bridge.js

ObjC.import('stdlib');
ObjC.import('Foundation');
ObjC.import('AppKit');

class MacOSTelemetryBridge {
    constructor() {
        this.app = Application.currentApplication();
        this.app.includeStandardAdditions = true;
        this.logPath = `${this.app.pathTo('home folder')}/Library/Logs/telemetry_bridge.log`;
    }

    writeLog(level, message) {
        const timestamp = new Date().toISOString();
        const logLine = `[${timestamp}] [${level}] ${message}\n`;
        try {
            const fileManager = \$.NSFileManager.defaultManager;
            const nsString = \$.NSString.stringWithString(logLine);
            if (!fileManager.fileExistsAtPath(this.logPath)) {
                nsString.writeToFileAtomicallyEncodingError(this.logPath, true, \$.NSUTF8StringEncoding, null);
            } else {
                const fileHandle = \$.NSFileHandle.fileHandleForWritingAtPath(this.logPath);
                fileHandle.seekToEndOfFile;
                fileHandle.writeData(nsString.dataUsingEncoding(\$.NSUTF8StringEncoding));
                fileHandle.closeFile;
            }
        } catch (err) {
            this.app.displayAlert("Logging System Failure", { message: String(err) });
        }
    }

    executeSystemCommand(command) {
        try {
            this.writeLog("DEBUG", `Executing POSIX sub-shell stream: ${command}`);
            return this.app.doShellScript(command).trim();
        } catch (err) {
            this.writeLog("ERROR", `Sub-shell command fault: ${command}. Context: ${String(err)}`);
            throw err;
        }
    }

    gatherSystemMetrics() {
        this.writeLog("INFO", "Initiating core hardware diagnostic poll loop...");
        
        const hostName = this.executeSystemCommand("hostname");
        const osVersion = this.executeSystemCommand("sw_vers -productVersion");
        const cpuLoad = this.executeSystemCommand("ps -A -o %cpu | awk '{s+=\$1} END {print s}'");
        const memoryPressure = this.executeSystemCommand("sysctl -n vm.page_pageable_internal_count || echo '0'");
        
        let batteryStatus = "AC Power Connected";
        try {
            batteryStatus = this.executeSystemCommand("pmset -g batt | grep -Eo '\\d+%' | head -n 1");
        } catch (e) {
            this.writeLog("WARN", "Battery registers unreadable (Likely running on desktop Mac architecture).");
        }

        return { hostName, osVersion, cpuLoad, memoryPressure, batteryStatus };
    }

    dispatchNativeNotification(metrics) {
        const payloadText = `CPU Load: ${metrics.cpuLoad}% | Batt: ${metrics.batteryStatus}`;
        this.app.displayNotification(payloadText, {
            withTitle: "macOS Core Telemetry Engine",
            subtitle: `Host: ${metrics.hostName} (macOS ${metrics.osVersion})`,
            soundName: "Glass"
        });
    }

    renderControlPanel() {
        const dialogText = "⚠️ macOS Advanced Diagnostic Operational Control Center\n\nChoose an automated orchestration pipeline layer below:";
        
        const response = this.app.displayDialog(dialogText, {
            buttons: ["Flush Storage", "Purge Inactive RAM", "Cancel/Exit"],
            defaultButton: "Cancel/Exit",
            cancelButton: "Cancel/Exit",
            withTitle: "Telemetry Bridge System Controller",
            withIcon: "note"
        });

        this.processUserAction(response.buttonReturned);
    }

    processUserAction(action) {
        this.writeLog("INFO", `User triggered operational control node: ${action}`);
        
        switch (action) {
            case "Flush Storage":
                const cacheDir = `${this.app.pathTo('home folder')}/Library/Caches/TemporaryItems`;
                this.executeSystemCommand(`mkdir -p ${cacheDir} && rm -rf ${cacheDir}/*`);
                this.app.displayAlert("Operation Success", { message: "Volatile application sub-cache layers successfully purged." });
                break;
                
            case "Purge Inactive RAM":
                try {
                    this.executeSystemCommand("sudo -n purge || purge");
                    this.app.displayAlert("Operation Success", { message: "Inactive system page blocks released from core kernel workspace memory." });
                } catch (err) {
                    this.app.displayAlert("Permission Constraint Error", { message: "Root access required to execute a global page cache purge step." });
                }
                break;
                
            default:
                this.writeLog("INFO", "Exiting management matrix tracking loops cleanly.");
                break;
        }
    }

    orchestrate() {
        try {
            const metrics = this.gatherSystemMetrics();
            this.dispatchNativeNotification(metrics);
            this.renderControlPanel();
        } catch (criticalErr) {
            this.writeLog("CRITICAL", `Global orchestration structural failure: ${String(criticalErr)}`);
        }
    }
}

// Global script instantiation entry gate
const engine = new MacOSTelemetryBridge();
engine.orchestrate();

/**
 * AppLauncher.jsx — Main macOS app launcher UI.
 * Reads /Applications, provides search filter, admin toggle, and refresh.
 */
function AppLauncher(props) {
    const { dc, styles, AppCard } = props;
    const { useState, useEffect, useMemo } = dc;

    const fs = require('fs');
    const path = require('path');
    const { spawn } = require('child_process');

    const [apps, setApps] = useState([]);
    const [search, setSearch] = useState('');
    const [isAdmin, setIsAdmin] = useState(false);
    const [loading, setLoading] = useState(true);
    const [statusMsg, setStatusMsg] = useState('');
    const [icons, setIcons] = useState({});

    useEffect(function () {
        loadApps();
    }, []);

    // Extract icons in background
    useEffect(function () {
        if (apps.length === 0 || !dc.app) return;

        let active = true;
        async function extractAllIcons() {
            try {
                const basePath = dc.app.vault.adapter.getBasePath();
                const cacheDir = path.join(basePath, props.folderPath, 'data', 'cache', 'icons');
                
                try {
                    await fs.promises.mkdir(cacheDir, { recursive: true });
                } catch (e) {}

                for (let i = 0; i < apps.length; i++) {
                    if (!active) break;
                    const app = apps[i];
                    const destPath = path.join(cacheDir, app.name + '.png');
                    
                    const relativeIconPath = path.join(props.folderPath, 'data', 'cache', 'icons', app.name + '.png');
                    let exists = false;
                    try {
                        await fs.promises.access(destPath);
                        exists = true;
                    } catch (e) {}

                    if (exists) {
                        const resourceUrl = dc.app.vault.adapter.getResourcePath(relativeIconPath);
                        setIcons(function (prev) {
                            return Object.assign({}, prev, { [app.path]: resourceUrl });
                        });
                        continue;
                    }

                    const srcIconPath = getAppIconPath(app.path);
                    if (srcIconPath) {
                        try {
                            await executeCommand('sips', ['-s', 'format', 'png', '-z', '64', '64', srcIconPath, '--out', destPath]);
                            const resourceUrl = dc.app.vault.adapter.getResourcePath(relativeIconPath);
                            setIcons(function (prev) {
                                return Object.assign({}, prev, { [app.path]: resourceUrl });
                            });
                        } catch (err) {
                            // ignore sips errors gracefully
                        }
                    }
                }
            } catch (err) {
                console.error("Open Application: Icon background extraction error:", err);
            }
        }

        extractAllIcons();
        return function () { active = false; };
    }, [apps, props.folderPath]);

    function getAppIconPath(appPath) {
        try {
            const infoPath = path.join(appPath, 'Contents', 'Info');
            let iconName = '';
            try {
                const { execSync } = require('child_process');
                iconName = execSync(`defaults read "${infoPath}" CFBundleIconFile`, { encoding: 'utf8' }).trim();
            } catch (e) {}

            if (iconName) {
                if (!iconName.endsWith('.icns')) {
                    const testPath = path.join(appPath, 'Contents', 'Resources', iconName + '.icns');
                    if (fs.existsSync(testPath)) return testPath;
                } else {
                    const testPath = path.join(appPath, 'Contents', 'Resources', iconName);
                    if (fs.existsSync(testPath)) return testPath;
                }
                const tiffPath = path.join(appPath, 'Contents', 'Resources', iconName.replace('.icns', '') + '.tiff');
                if (fs.existsSync(tiffPath)) return tiffPath;
            }

            const resourcesPath = path.join(appPath, 'Contents', 'Resources');
            if (fs.existsSync(resourcesPath)) {
                const files = fs.readdirSync(resourcesPath);
                const icnsFile = files.find(function (f) { return f.endsWith('.icns'); });
                if (icnsFile) return path.join(resourcesPath, icnsFile);
                
                const tiffFile = files.find(function (f) { return f.endsWith('.tiff'); });
                if (tiffFile) return path.join(resourcesPath, tiffFile);
            }
        } catch (err) {
            console.error("Open Application: Error finding icon for " + appPath, err);
        }
        return null;
    }

    async function loadApps() {
        setLoading(true);
        setStatusMsg('');
        try {
            const appDir = '/Applications';
            const files = await fs.promises.readdir(appDir);

            const appList = files
                .filter(function (file) { return file.endsWith('.app'); })
                .map(function (file) {
                    return {
                        name: file.replace('.app', ''),
                        path: path.join(appDir, file),
                        filename: file
                    };
                })
                .sort(function (a, b) { return a.name.localeCompare(b.name); });

            setApps(appList);
        } catch (err) {
            console.error("Open Application: Failed to list apps:", err);
            setStatusMsg("Error reading /Applications: " + err.message);
        } finally {
            setLoading(false);
        }
    }

    function executeCommand(cmd, args) {
        return new Promise(function (resolve, reject) {
            const child = spawn(cmd, args, { stdio: 'ignore', detached: true });
            child.unref();
            child.on('error', reject);
            setTimeout(resolve, 500);
        });
    }

    async function openApp(appItem) {
        try {
            if (isAdmin) {
                const osaCmd = 'do shell script "open -a \\"' + appItem.path + '\\"" with administrator privileges';
                await executeCommand('osascript', ['-e', osaCmd]);
                new Notice("Launched (Admin): " + appItem.name);
            } else {
                await executeCommand('open', ['-a', appItem.path]);
                new Notice("Launched: " + appItem.name);
            }
        } catch (err) {
            console.error("Open Application: Failed to launch:", err);
            new Notice("Failed: " + err.message);
        }
    }

    function toggleAdmin() { setIsAdmin(function (prev) { return !prev; }); }

    function handleSearchChange(e) { setSearch(e.target.value); }

    const filteredApps = useMemo(function () {
        if (!search) return apps;
        const q = search.toLowerCase();
        return apps.filter(function (app) { return app.name.toLowerCase().includes(q); });
    }, [apps, search]);

    const enrichedApps = useMemo(function () {
        return filteredApps.map(function (app) {
            return Object.assign({}, app, {
                iconUrl: icons[app.path] || null
            });
        });
    }, [filteredApps, icons]);

    const adminBtnStyle = Object.assign(
        {},
        styles.controlBtn,
        isAdmin ? styles.controlBtnAdmin : {}
    );

    return (
        <div style={styles.container}>
            <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>

            {/* Header */}
            <div style={styles.header}>
                <h2 style={styles.title}>Open App</h2>

                <div style={styles.searchContainer}>
                    <input
                        id="open-app-search"
                        type="text"
                        placeholder="Search applications..."
                        value={search}
                        onChange={handleSearchChange}
                        style={styles.searchInput}
                        autoFocus
                    />
                </div>

                <div style={styles.controls}>
                    <div
                        id="open-app-admin-toggle"
                        style={adminBtnStyle}
                        onClick={toggleAdmin}
                        title={isAdmin ? "Admin mode active — click to disable" : "Enable admin mode"}
                    >
                        <dc.Icon icon="shield" size={14} />
                        {isAdmin ? "Admin On" : "Admin"}
                    </div>
                    <div
                        id="open-app-refresh"
                        style={styles.controlBtn}
                        onClick={loadApps}
                        title="Refresh application list"
                    >
                        <dc.Icon icon="refresh-cw" size={14} />
                    </div>
                </div>
            </div>

            {/* Content */}
            <div style={styles.content}>
                {statusMsg && <div style={styles.statusMsg}>{statusMsg}</div>}

                {loading ? (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '200px' }}>
                        <div style={styles.spinner} />
                    </div>
                ) : (
                    <div style={styles.grid}>
                        {enrichedApps.map(function (app) {
                            return (
                                <AppCard
                                    key={app.path}
                                    app={app}
                                    onClick={openApp}
                                    dc={dc}
                                    styles={styles}
                                />
                            );
                        })}
                    </div>
                )}

                {!loading && enrichedApps.length === 0 && (
                    <div style={styles.emptyState}>No applications found.</div>
                )}
            </div>
        </div>
    );
}

return { AppLauncher };

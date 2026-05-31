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

    useEffect(function () {
        loadApps();
    }, []);

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
                        {filteredApps.map(function (app) {
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

                {!loading && filteredApps.length === 0 && (
                    <div style={styles.emptyState}>No applications found.</div>
                )}
            </div>
        </div>
    );
}

return { AppLauncher };

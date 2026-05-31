/**
 * AppCard.jsx — Single application tile for the Open Application launcher.
 */
function AppCard(props) {
    const { app, onClick, dc, styles } = props;
    const { useState } = dc;

    const [hover, setHover] = useState(false);
    const [loading, setLoading] = useState(false);

    async function handleClick() {
        setLoading(true);
        try {
            await onClick(app);
        } finally {
            setLoading(false);
        }
    }

    function handleMouseEnter() { setHover(true); }
    function handleMouseLeave() { setHover(false); }

    const letter = app.name.charAt(0).toUpperCase();
    const cardStyle = Object.assign({}, styles.appCard, hover ? styles.appCardHover : {});

    return (
        <div
            style={cardStyle}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onClick={handleClick}
            title={app.name}
        >
            <div style={styles.appIcon}>{letter}</div>
            <div style={styles.appName}>{app.name}</div>

            {loading && (
                <div style={styles.loadingOverlay}>
                    <div style={styles.spinner} />
                </div>
            )}
        </div>
    );
}

return { AppCard };

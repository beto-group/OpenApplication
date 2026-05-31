const STYLES = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        background: 'var(--background-primary)',
        color: 'var(--text-normal)',
        fontFamily: 'var(--font-interface, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif)',
        overflow: 'hidden'
    },
    header: {
        padding: '16px 20px',
        borderBottom: '1px solid var(--background-modifier-border)',
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        background: 'var(--background-secondary)',
        flexShrink: 0
    },
    title: {
        fontSize: '16px',
        fontWeight: '700',
        color: 'var(--text-normal)',
        margin: 0,
        whiteSpace: 'nowrap'
    },
    searchContainer: {
        flex: 1,
        position: 'relative'
    },
    searchInput: {
        width: '100%',
        padding: '8px 14px',
        borderRadius: '6px',
        border: '1px solid var(--background-modifier-border)',
        background: 'var(--background-modifier-form-field)',
        color: 'var(--text-normal)',
        fontSize: '14px',
        outline: 'none',
        transition: 'border-color 0.2s',
        boxSizing: 'border-box'
    },
    controls: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
    },
    controlBtn: {
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        cursor: 'pointer',
        userSelect: 'none',
        padding: '6px 12px',
        borderRadius: '6px',
        border: '1px solid var(--background-modifier-border)',
        background: 'var(--background-secondary)',
        color: 'var(--text-muted)',
        fontSize: '12px',
        fontWeight: '500',
        transition: 'background 0.15s, color 0.15s'
    },
    controlBtnAdmin: {
        background: 'var(--color-red-rgb, #7f1d1d)',
        borderColor: 'var(--text-error, #ef4444)',
        color: 'var(--text-on-accent, #fff)'
    },
    content: {
        flex: 1,
        overflowY: 'auto',
        padding: '16px 20px'
    },
    grid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(110px, 1fr))',
        gap: '12px'
    },
    appCard: {
        background: 'var(--background-secondary)',
        border: '1px solid var(--background-modifier-border)',
        borderRadius: '10px',
        padding: '14px 10px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        transition: 'transform 0.1s, background 0.15s, border-color 0.15s',
        textAlign: 'center',
        height: '130px',
        position: 'relative'
    },
    appCardHover: {
        background: 'var(--background-modifier-hover)',
        borderColor: 'var(--interactive-accent)',
        transform: 'translateY(-2px)'
    },
    appIcon: {
        width: '44px',
        height: '44px',
        marginBottom: '10px',
        borderRadius: '10px',
        background: 'var(--background-modifier-border)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '20px',
        fontWeight: '700',
        color: 'var(--text-muted)'
    },
    appIconImg: {
        width: '44px',
        height: '44px',
        marginBottom: '10px',
        objectFit: 'contain',
        pointerEvents: 'none'
    },
    appName: {
        fontSize: '12px',
        fontWeight: '500',
        color: 'var(--text-normal)',
        wordBreak: 'break-word',
        lineHeight: '1.35',
        display: '-webkit-box',
        WebkitLineClamp: 2,
        WebkitBoxOrient: 'vertical',
        overflow: 'hidden'
    },
    loadingOverlay: {
        position: 'absolute',
        inset: 0,
        background: 'rgba(0,0,0,0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '10px'
    },
    spinner: {
        width: '18px',
        height: '18px',
        border: '2px solid rgba(255,255,255,0.2)',
        borderTopColor: 'var(--interactive-accent, #fff)',
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite'
    },
    emptyState: {
        textAlign: 'center',
        color: 'var(--text-muted)',
        padding: '40px 20px'
    },
    statusMsg: {
        color: 'var(--text-error)',
        marginBottom: '16px',
        fontSize: '13px',
        fontFamily: 'var(--font-monospace)'
    }
};

return { STYLES };

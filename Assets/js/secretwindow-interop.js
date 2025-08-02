
export function registerSecretWindowInterop(dotnetRef) {
    window.addEventListener('show-secret-window', () => {
        if (dotnetRef) dotnetRef.invokeMethodAsync('ShowSecretWindow');
    });
}

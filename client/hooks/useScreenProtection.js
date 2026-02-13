import { useEffect } from 'react';

export const useScreenProtection = () => {
    useEffect(() => {
        // Prevent Right Click
        const handleContextMenu = (e) => {
            e.preventDefault();
        };

        // Prevent Dragging
        const handleDragStart = (e) => {
            e.preventDefault();
        };

        // Prevent PrintScreen / Screenshots (Deterrent)
        // Note: Detecting "PrintScreen" key only works if the window has focus.
        // True OS-level screenshot prevention is not possible in browser.
        const handleKeyUp = (e) => {
            if (e.key === 'PrintScreen') {
                document.body.style.display = 'none';
                alert('Screenshots are disabled for privacy.');
                setTimeout(() => {
                    document.body.style.display = 'block';
                }, 1000);
            }
        };

        // Disable standard copy shortcuts? 
        const handleKeyDown = (e) => {
            // Block Ctrl+P (Print)
            if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
                e.preventDefault();
                alert('Printing is disabled.');
            }
            // Block Ctrl+S (Save)
            if ((e.ctrlKey || e.metaKey) && e.key === 's') {
                e.preventDefault();
            }
        };

        document.addEventListener('contextmenu', handleContextMenu);
        document.addEventListener('dragstart', handleDragStart);
        document.addEventListener('keyup', handleKeyUp);
        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('contextmenu', handleContextMenu);
            document.removeEventListener('dragstart', handleDragStart);
            document.removeEventListener('keyup', handleKeyUp);
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, []);
};

import React, { useState } from 'react';

export function Sheet({ children }) {
    // children: [trigger, content]
    const [open, setOpen] = useState(false);
    const [Trigger, Content] = React.Children.toArray(children);

    return (
        <>
            {React.cloneElement(Trigger, { onClick: () => setOpen(true) })}
            {open && (
                <div
                    className="fixed inset-0 bg-black/50 flex justify-end"
                    onClick={() => setOpen(false)}
                >
                    <div
                        className="bg-white w-80 h-full"
                        onClick={e => e.stopPropagation()}
                    >
                        {Content}
                    </div>
                </div>
            )}
        </>
    );
}

export const SheetTrigger = ({ children, asChild = false, ...props }) =>
    React.cloneElement(asChild ? children : <button {...props} />, props);

export const SheetContent = ({ children, className = '', ...props }) => (
    <div {...props} className={`p-4 ` + className}>
        {children}
    </div>
);

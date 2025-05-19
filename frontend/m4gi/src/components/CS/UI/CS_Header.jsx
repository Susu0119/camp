import React from 'react';
import Logo from '../../UI/Logo';
import ProfileButton from '../../UI/ProfileButton';

export default function CSHeader() {
    return (
        <header className="flex items-center w-full h-[65px] border-b border-[#e5e7eb]">
            <div className="flex items-center justify-between px-5 w-full">
                <div className="flex items-center">
                    <div className="flex items-center">
                        <div className="flex items-center">
                            <Logo />
                        </div>
                    </div>
                </div>
                <div className="flex items-center">
                    <ProfileButton />
                </div>
            </div>
        </header>
    );
};
import React from "react";
import Header from "../page/Header.tsx";
import Footer from "../page/Footer.tsx";

interface LayoutProps {
    readonly children: React.ReactNode;
}

export default function Layout({children}: LayoutProps) {
    return (
        <div className="layout-wrapper">
            <Header/>
            <main className="layout-main">
                {children}
            </main>
            <Footer/>
        </div>
    );
}
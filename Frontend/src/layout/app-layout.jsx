import React from "react";
import { Outlet } from "react-router-dom";
import '../App.css'
import Header from "@/components/Header";

export default function AppLayout(){
    return(
        <div className="mx-20">
            <div className="grid-background "></div>
            <main className="min-h-screen container ">
                <Header />
                <Outlet />
            </main>
            <div className="p-5 text-center bg-gray-800 mt-10 ">
                Made with 💗 by Arshad Jamil
            </div>
        </div>
    )
}
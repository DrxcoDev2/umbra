//import Link from 'next/link'

export default function SlideBar() {
    return(
        <div className="max-w-[300px] flex justify-center ">
            <div className="pt-20 space-y-5">
                <div className="flex space-x-5">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><path fill="currentColor" d="m2.45 10.575l4.2-4.2q.35-.35.825-.5t.975-.05l1.3.275Q8.4 7.7 7.625 9t-1.5 3.15zm5.125 2.275q.575-1.8 1.563-3.4t2.387-3q2.2-2.2 5.025-3.287t5.275-.663q.425 2.45-.65 5.275T17.9 12.8q-1.375 1.375-3 2.388t-3.425 1.587zm6.9-3q.575.575 1.413.575T17.3 9.85t.575-1.412t-.575-1.413t-1.412-.575t-1.413.575t-.575 1.413t.575 1.412m-.7 12.025l-1.6-3.675q1.85-.725 3.163-1.5t2.912-2.125l.25 1.3q.1.5-.05.988t-.5.837zM4.05 16.05q.875-.875 2.125-.888t2.125.863t.875 2.125t-.875 2.125q-.625.625-2.087 1.075t-4.038.8q.35-2.575.8-4.025T4.05 16.05"/></svg>
                    <h1 className="text-xl">Feed</h1>
                </div>
                <div className="flex space-x-5">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><path fill="currentColor" d="M12 12q-1.65 0-2.825-1.175T8 8t1.175-2.825T12 4t2.825 1.175T16 8t-1.175 2.825T12 12m-8 8v-2.8q0-.85.438-1.562T5.6 14.55q1.55-.775 3.15-1.162T12 13t3.25.388t3.15 1.162q.725.375 1.163 1.088T20 17.2V20z"/></svg>
                    <h1 className="text-xl">Profile</h1>
                </div>
                <div className="flex space-x-5">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><g fill="currentColor" fillOpacity="0"><path d="M15.22 6.03l2.53-1.94L14.56 4L13.5 1l-1.06 3l-3.19.09l2.53 1.94l-.91 3.06l2.63-1.81l2.63 1.81z"><animate id="lineMdMoonFilledLoop0" fill="freeze" attributeName="fill-opacity" begin="0.7s;lineMdMoonFilledLoop0.begin+6s" dur="0.4s" values="0;1"/><animate fill="freeze" attributeName="fill-opacity" begin="lineMdMoonFilledLoop0.begin+2.2s" dur="0.4s" values="1;0"/></path><path d="M13.61 5.25L15.25 4l-2.06-.05L12.5 2l-.69 1.95L9.75 4l1.64 1.25l-.59 1.98l1.7-1.17l1.7 1.17z"><animate fill="freeze" attributeName="fill-opacity" begin="lineMdMoonFilledLoop0.begin+3s" dur="0.4s" values="0;1"/><animate fill="freeze" attributeName="fill-opacity" begin="lineMdMoonFilledLoop0.begin+5.2s" dur="0.4s" values="1;0"/></path><path d="M19.61 12.25L21.25 11l-2.06-.05L18.5 9l-.69 1.95l-2.06.05l1.64 1.25l-.59 1.98l1.7-1.17l1.7 1.17z"><animate fill="freeze" attributeName="fill-opacity" begin="lineMdMoonFilledLoop0.begin+0.4s" dur="0.4s" values="0;1"/><animate fill="freeze" attributeName="fill-opacity" begin="lineMdMoonFilledLoop0.begin+2.8s" dur="0.4s" values="1;0"/></path><path d="M20.828 9.731l1.876-1.439l-2.366-.067L19.552 6l-.786 2.225l-2.366.067l1.876 1.439L17.601 12l1.951-1.342L21.503 12z"><animate fill="freeze" attributeName="fill-opacity" begin="lineMdMoonFilledLoop0.begin+3.4s" dur="0.4s" values="0;1"/><animate fill="freeze" attributeName="fill-opacity" begin="lineMdMoonFilledLoop0.begin+5.6s" dur="0.4s" values="1;0"/></path></g><path fill="currentColor" fill-opacity="0" stroke="currentColor" stroke-dasharray="56" stroke-dashoffset="56" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 6 C7 12.08 11.92 17 18 17 C18.53 17 19.05 16.96 19.56 16.89 C17.95 19.36 15.17 21 12 21 C7.03 21 3 16.97 3 12 C3 8.83 4.64 6.05 7.11 4.44 C7.04 4.95 7 5.47 7 6 Z"><animate fill="freeze" attributeName="fill-opacity" begin="1.5s" dur="0.5s" values="0;1"/><animate fill="freeze" attributeName="stroke-dashoffset" dur="0.6s" values="56;0"/></path></svg>
                    <h1 className="text-xl">Moon.AI</h1>
                </div>
                
            </div>
        </div>
    );
}
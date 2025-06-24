import Link from 'next/link';


export default function Form() {
    return (

        <div className="flex space-x-5">
            <div className="w-42">
                <div className="p-5 bg-amber-50 text-black flex justify-center rounded-lg text-xl">
                    <Link href="/register">Register</Link>
                </div>
            </div>
            <div className="w-42">
                <div className="p-5 text-amber-50 flex justify-center rounded-lg text-xl">
                    <Link href="/login">Login</Link>
                </div>
            </div>
        </div>
        
    );
}
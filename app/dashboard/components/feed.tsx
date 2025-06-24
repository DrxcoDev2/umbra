import Publ from "./publ";

export default function Feed() {
    return(
        <div className="max-w-[600px] h-auto pt-20 ">
            <h1 className="text-4xl">Feed</h1>
            <div className="pl-8 pt-10">
                <Publ></Publ>
            </div>
        </div>
    );
}
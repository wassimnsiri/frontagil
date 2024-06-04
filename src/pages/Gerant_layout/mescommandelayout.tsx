import DropdownUser from "../../components/Header/DropdownUser";
import Footer from "../../components/Header/Footer";
import Header from "../../components/Header/Header";
import Mescommande from "./mescomande";


const Mescommandelayout = () => {
    return (
        <>
            <Header />
            <div className="flex flex-col items-center justify-center gap-10">
                <Mescommande />
            </div>
            <Footer />
        </>
    );
}

export default Mescommandelayout;

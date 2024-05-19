import DropdownUser from "../../components/Header/DropdownUser";
import Footer from "../../components/Header/Footer";
import Header from "../../components/Header/Header";
import ProduitGrid from "./produitgrid";

const Welcom = () => {
    return (
        <>
            <Header />
            <div className="flex flex-col items-center justify-center gap-10">
                <ProduitGrid />
            </div>
            <Footer />
        </>
    );
}

export default Welcom;

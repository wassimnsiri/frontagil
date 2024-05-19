

const Footer = () => {
    return (
        <footer className="bg-black text-white py-6">
            <div className="container mx-auto flex flex-col items-center">
                <p className="text-sm">© 2024 My Application. All rights reserved.</p>
                <div className="flex mt-2">
                    <a href="#" className="mr-4 text-gray-300 hover:text-gray-100 transition duration-300">
                        Terms of Service
                    </a>
                    <a href="#" className="mr-4 text-gray-300 hover:text-gray-100 transition duration-300">
                        Privacy Policy
                    </a>
                    <a href="#" className="text-gray-300 hover:text-gray-100 transition duration-300">
                        Contact Us
                    </a>
                </div>
            </div>
        </footer>
    );
}

export default Footer;

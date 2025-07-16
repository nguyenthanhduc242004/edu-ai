import Footer from './Footer';
import Header from './Header';

export default function DefaultLayout({ children }) {
    return (
        <div className="flex flex-col min-h-[100vh]">
            <Header />
            <div className="container mx-auto p-6 flex-grow">{children}</div>
            <Footer />
        </div>
    );
}

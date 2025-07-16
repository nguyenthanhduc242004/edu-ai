import { BrowserRouter, Route, Routes } from 'react-router-dom';
import AllPage from '../pages/AllPage';
import FavoritePage from '../pages/FavoritePage';
import HistoryPage from '../pages/HistoryPage';
import PageNotFound from '../layouts/PageNotFound';
import DefaultLayout from '../layouts/DefaultLayout/DefaultLayout';
import HomePage from '../pages/HomePage';
import { GlobalProvider } from '../contexts/GlobalContext';

export default function MainRoutes() {
    return (
        <GlobalProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<DefaultLayout children={<HomePage />} />} />
                    <Route path="/all" element={<DefaultLayout children={<AllPage />} />} />
                    <Route path="/favorite" element={<DefaultLayout children={<FavoritePage />} />} />
                    <Route path="/history" element={<DefaultLayout children={<HistoryPage />} />} />
                    <Route path="*" element={<PageNotFound />} />
                </Routes>
            </BrowserRouter>
        </GlobalProvider>
    );
}

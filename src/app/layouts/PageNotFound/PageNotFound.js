import React from 'react';
import Button from '../../components/Button';
import { Link } from 'react-router-dom';

export default function PageNotFound() {
    return (
        <section class="bg-white">
            <div class="mx-auto max-w-screen-xl">
                <div class="mx-auto max-w-screen-sm text-center min-h-[100vh] flex flex-col justify-center items-center">
                    <h1 class="mb-4 text-7xl tracking-tight font-extrabold lg:text-9xl text-primary-600">404</h1>
                    <p class="mb-4 text-3xl tracking-tight font-bold text-gray-900 md:text-4xl">
                        Không tìm thấy trang.
                    </p>
                    <p class="mb-4 mx-6 text-lg font-light text-gray-500">
                        Rất tiếc, chúng tôi không tìm thấy trang này. Bạn sẽ tìm thấy rất nhiều điều để khám phá trên
                        trang chủ.{' '}
                    </p>
                    <Link to="/">
                        <Button varient="light" href="#" className="w-60 mt-4">
                            Trở về trang chủ
                        </Button>
                    </Link>
                </div>
            </div>
        </section>
    );
}

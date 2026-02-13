import "@/styles/globals.css";
import Script from "next/script";

export default function App({ Component, pageProps }) {
    return (
        <>
            <Script
                id="razorpay-checkout-js"
                src="https://checkout.razorpay.com/v1/checkout.js"
                strategy="lazyOnload"
            />
            <Component {...pageProps} />
        </>
    );
}

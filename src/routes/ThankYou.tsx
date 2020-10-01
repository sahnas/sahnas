import { h } from 'preact';
import { useContext } from 'preact/hooks';
import { ConfigContext } from '../AppContext';
import { RouteLink } from '../layout/Router';

const ThankYou = () => {
    const config = useContext(ConfigContext);

    return (
        <div>
            <h2>{config.text.thankYouTitle ?? 'Merci'}</h2>
            <p>{config.text.thankYouBody ?? 'Votre message a bien été envoyé.'}</p>
            <p>
                En attendant, vous pouvez consulter la <RouteLink href='/faq'>FAQ</RouteLink>.</p>
        </div>
    );
};

export default ThankYou;

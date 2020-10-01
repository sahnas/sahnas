import { h, Fragment } from 'preact';
import { useContext, useState, useEffect } from 'preact/hooks';
import { ServiceContext } from '../AppContext';
import style from './faq.css';
import { FaqModel } from '../models';
import clsx from 'clsx';
import { RouteLink } from '../layout/Router';
import { useTimeout } from '../hooks';

const Faq = () => {
    const service = useContext(ServiceContext);
    const [questions, setQuestions] = useState<FaqModel[] | undefined>(
        undefined
    );
    const [visible, setVisible] = useState(0);
    const [statusText, setStatusText] = useState('');

    const loaders = [
        useTimeout(() => !questions && setStatusText('Chargement...'), 500),
        useTimeout(() => !questions && setStatusText('Ca charge toujours...'), 5000),
        useTimeout(
            () =>
                !questions &&
                setStatusText('Le backend ne semble pas chaud...'),
            10000
        ),
    ];

    useEffect(() => {
        service
            ?.getFaq()
            .then(setQuestions)
            .catch(() => setStatusText('Impossible de charger les questions, ressayez plus tard.'))
            .then(() => loaders.forEach((c) => c()));
    }, [service]);

    return (
        <div>
            {!questions ? (
                statusText
            ) : (
                <Fragment>
                    <p>
                        Voici la FAQ. Vous pouvez aussi me contacter<RouteLink href='/'> ici</RouteLink>.
                    </p>
                    <ul className={style.root}>
                        {questions.map((q, i) => (
                            <li
                                key={i}
                                className={clsx({
                                    [style.visible]: i === visible,
                                })}
                            >
                                <a
                                    href='javascript:;'
                                    onClick={() => setVisible(i)}
                                >
                                    {q.question}
                                </a>
                                {q.answer.map((t, id) => (
                                    <span key={id}>{t}</span>
                                ))}
                            </li>
                        ))}
                    </ul>
                </Fragment>
            )}
        </div>
    );
};

export default Faq;

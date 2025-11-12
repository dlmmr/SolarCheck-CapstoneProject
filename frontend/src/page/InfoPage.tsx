import BalkonkraftwerkBeispielBild from "./images/BalkonkraftwerkBeispiel.png";

export default function InfoPage() {
    return (
        <div className="page page--wide">
            <div className="FormAndResultContainer">
                <h1>Balkonkraftwerke verstehen</h1>

                <div className="FormAndResultContent">
                    <section>
                        <h2>Was ist ein Balkonkraftwerk?</h2>
                        <p>
                            Ein Balkonkraftwerk ist eine <strong>steckerfertige Mini-Solaranlage</strong>{' '}die
                            Sie einfach an Ihre Steckdose anschließen können. Die Anlage besteht aus
                            <strong> Solarpaneelen</strong>{' '} (meist 2-4 Module) und einem{' '}
                            <strong>Wechselrichter</strong>, der den erzeugten Gleichstrom in nutzbaren
                            Wechselstrom für Ihr Zuhause umwandelt.
                        </p>
                        <p>
                            Der erzeugte Strom fließt direkt in Ihren Haushalt und reduziert Ihren Strombezug
                            vom Netz – Sie verbrauchen also weniger kostenpflichtigen Netzstrom. Erste
                            Komplettsysteme sind bereits <strong>ab etwa 300 Euro</strong> bei großen Discountern erhältlich.
                        </p>
                    </section>

                    <section>
                        <div className={"info-images"}>
                        <img
                            src={BalkonkraftwerkBeispielBild}
                            alt="Beispielbild eines Balkonkraftwerks mit Wechselrichter"
                        />
                        </div>
                    </section>

                    <section>
                        <h2>Ihre Vorteile im Überblick</h2>
                        <div className="info-grid">
                            <div className="info-card">
                                <h3>Sofortige Kostenersparnis</h3>
                                <p>
                                    Je nach Ausrichtung und Größe können Sie 10-30% Ihres
                                    jährlichen Strombedarfs selbst decken und damit Ihre Stromrechnung senken.
                                </p>
                            </div>

                            <div className="info-card">
                                <h3>Mieterfreundlich</h3>
                                <p>
                                    Auch als Mieter können Sie aktiv an der Energiewende teilnehmen –
                                    ohne bauliche Veränderungen am Gebäude vorzunehmen.
                                </p>
                            </div>

                            <div className="info-card">
                                <h3>Flexibel und transportabel</h3>
                                <p>
                                    Bei einem Umzug nehmen Sie Ihre Anlage einfach mit. Keine langfristige
                                    Bindung an eine Immobilie.
                                </p>
                            </div>

                            <div className="info-card">
                                <h3>Klimafreundlich</h3>
                                <p>
                                    Erzeugen Sie saubere Solarenergie direkt vor Ort und reduzieren Sie
                                    Ihren CO₂-Fußabdruck – typischerweise um 200-400 kg CO₂ pro Jahr.
                                </p>
                            </div>
                        </div>
                    </section>

                    <section>
                        <h2>Aktuelle Regelungen 2024/2025</h2>
                        <div className="info-list">
                            <div>
                                <strong>800 Watt Einspeiseleistung:</strong> Die maximale Einspeiseleistung
                                wurde von 600W auf 800W erhöht, was den Ertrag Ihrer Anlage steigert.
                            </div>

                            <div>
                                <strong>Vereinfachte Anmeldung:</strong> Die Anmeldung beim Netzbetreiber und
                                im Marktstammdatenregister wurde stark vereinfacht und ist meist online in
                                wenigen Minuten erledigt.
                            </div>

                            <div>
                                <strong>Vermieter-Regelung:</strong> Vermieter können die Installation nicht
                                mehr grundlos ablehnen. Bei Balkonmontage haben Sie ein weitgehendes Recht
                                auf Installation.
                            </div>

                            <div>
                                <strong>Fördermöglichkeiten:</strong> Viele Städte, Gemeinden und Bundesländer
                                unterstützen den Kauf von Balkonkraftwerken mit Zuschüssen oder Förderprogrammen.
                                Die Höhe und Bedingungen variieren je nach Wohnort, daher lohnt sich ein kurzer
                                Blick auf die lokalen Förderportale.
                            </div>

                        </div>
                    </section>

                    <section>
                        <h2>Was berechnet dieser Rechner?</h2>
                        <p>
                            Unser Balkonkraftwerk-Rechner hilft Ihnen, das Potenzial Ihrer eigenen
                            Solaranlage einzuschätzen. Basierend auf Ihren Angaben zu Stromverbrauch,
                            Strompreis, Anlagengröße, Ausrichtung, Neigungswinkel und Verschattung berechnen
                            wir Ihre voraussichtliche Stromerzeugung, Kostenersparnis, CO₂-Reduktion und
                            Amortisationszeit.
                        </p>
                        <p>
                            Zusätzlich zeigen wir Ihnen praktische Alltagswerte wie die mögliche E-Bike-
                            oder E-Auto-Reichweite sowie die Homeoffice-Abdeckung, die Sie mit Ihrem
                            selbst erzeugten Strom erreichen können.
                        </p>
                    </section>

                    <div className="info-highlight">
                        <strong>Fazit</strong>
                        <p>
                            Balkonkraftwerke sind eine einfache, kostengünstige Möglichkeit, Ihre
                            Stromkosten zu senken und aktiv zum Klimaschutz beizutragen – ohne großen
                            Installationsaufwand oder bauliche Veränderungen. Die Investition rechnet
                            sich meist innerhalb von 2-5 Jahren, und danach produzieren Sie jahrelang
                            kostenlos Ihren eigenen Strom.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
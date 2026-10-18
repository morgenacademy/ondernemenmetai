/**
 * Plaatje van de twee plekken waar je repo staat: je computer en GitHub.
 * Het groeit per level met één ding: level 1 pull, level 2 een map die alleen op je computer staat en merge.
 */
export function TweePlekken({ level }: { level: number }) {
  return (
    <figure className="twee-plekken">
      <div className="plekken">
        <div className="plek">
          <p className="plek-naam">Je computer</p>
          <p className="plek-rol">Hier werkt je AI</p>
          <ul>
            <li>je repo, met wat je AI maakt</li>
            {level >= 2 && (
              <li className="alleen-hier">
                je opnames in <code>interviews/</code> blijven hier: git slaat ze over
              </li>
            )}
          </ul>
        </div>
        <ul className="plek-pijlen">
          <li>
            <Pijl breed="→" smal="↓" />
            <span className="sr-only">Van je computer naar GitHub: </span>commit en push
          </li>
          {level >= 1 && (
            <li>
              <Pijl breed="←" smal="↑" />
              <span className="sr-only">Van GitHub naar je computer: </span>pull
            </li>
          )}
        </ul>
        <div className="plek">
          <p className="plek-naam">GitHub</p>
          <p className="plek-rol">Hier kijkt het platform mee</p>
          <ul>
            <li>je repo, na elke push</li>
            {level >= 1 && <li>wat je op het platform invult</li>}
            {level >= 2 && <li>een zijspoor (branch) dat je met Merge samenvoegt</li>}
          </ul>
        </div>
      </div>
      <figcaption>Twijfel je? Vraag je AI: "Is alles in sync?"</figcaption>
    </figure>
  );
}

function Pijl({ breed, smal }: { breed: string; smal: string }) {
  return (
    <span className="pijl" aria-hidden="true">
      <span className="pijl-breed">{breed}</span>
      <span className="pijl-smal">{smal}</span>
    </span>
  );
}

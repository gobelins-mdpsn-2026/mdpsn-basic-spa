export default function Footer({ remaining, onClearDone }) {
  return (
    <footer>
      <span>{remaining} à faire</span>
      <button className="link" onClick={onClearDone}>
        Effacer les faites
      </button>
    </footer>
  );
}

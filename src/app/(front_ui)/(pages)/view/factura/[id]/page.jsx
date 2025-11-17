async function Factura({ params }) {
  const { id } = await params;
  return <div>Factura con ID: {id}</div>;
}

export default Factura;

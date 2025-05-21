import { Container, Card } from "react-bootstrap";

const Dashboards = () => {
  return (
    <Container>
      <br />
      <Card style={{ height: 600 }}>
      <iframe title="DASHBOARD_KPI3" 
      width="1100" height="500.5" 
      src="https://app.powerbi.com/view?r=eyJrIjoiMTkzMWVhYzctMDExYi00NmQwLTgyMzItOWE0MzhhZjRkMGE2IiwidCI6ImU0NzY0NmZlLWRhMjctNDUxOC04NDM2LTVmOGIxNThiYTEyNyIsImMiOjR9" 
      frameborder="0" allowFullScreen="true"></iframe>
      </Card>
    </Container>
  );
};

export default Dashboards;
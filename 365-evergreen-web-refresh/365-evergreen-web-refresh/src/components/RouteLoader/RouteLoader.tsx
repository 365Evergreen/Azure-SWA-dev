import { Spinner } from '@fluentui/react-components';

function RouteLoader() {
  return (
    <div aria-live="polite" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '4rem 0' }}>
      <Spinner label="Loading content" labelPosition="below" size="large" />
    </div>
  );
}

export default RouteLoader;

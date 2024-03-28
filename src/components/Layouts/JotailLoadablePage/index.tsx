import { Box } from '@mui/material';
import { Loader } from '@/components';
import { Loadable } from 'jotai/vanilla/utils/loadable';
import CommonPageLayout, {
  CommonPageLayoutProps,
} from '@/components/Layouts/CommonPage';

export interface LoadablePageLayoutProps<T> extends CommonPageLayoutProps {
  jotaiLoadable: Loadable<T>;
}

export default function LoadablePageLayout<T>({
  jotaiLoadable,
  children,
  ...otherProps
}: LoadablePageLayoutProps<T>) {
  if (jotaiLoadable.state === 'loading') {
    return (
      <CommonPageLayout
        sxRootProps={{ alignItems: 'center', justifyContent: 'center' }}
        sxBodyProps={{ alignItems: 'center', justifyContent: 'center' }}
        {...otherProps}
      >
        <Loader />
      </CommonPageLayout>
    );
  }
  if (jotaiLoadable.state === 'hasError') {
    const message = jotaiLoadable.error
      ? jotaiLoadable.error.toString()
      : 'An unknown error occurred!';
    return (
      <CommonPageLayout
        sxRootProps={{ alignItems: 'center', justifyContent: 'center' }}
        sxBodyProps={{ alignItems: 'center', justifyContent: 'center' }}
        {...otherProps}
      >
        <Box>{message}</Box>
      </CommonPageLayout>
    );
  }
  return <CommonPageLayout {...otherProps}>{children}</CommonPageLayout>;
}

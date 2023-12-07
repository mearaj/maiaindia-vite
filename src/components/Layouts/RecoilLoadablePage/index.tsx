import { Loadable } from 'recoil';
import { Box } from '@mui/material';
import { Loader } from '@/components';
import CommonPageLayout, {
  CommonPageLayoutProps,
} from '@/components/Layouts/CommonPage';

export interface RecoilLoadablePageLayoutProps<T>
  extends CommonPageLayoutProps {
  recoilLoadable: Loadable<T>;
}

export default function RecoilLoadablePageLayout<T>({
  recoilLoadable,
  children,
  ...otherProps
}: RecoilLoadablePageLayoutProps<T>) {
  const { contents, state } = recoilLoadable;
  if (state === 'loading') {
    return (
      <CommonPageLayout
        sxRootProps={{ alignItems: 'center', justifyContent: 'center' }}
        sxBodyProps={{ alignItems: 'center', justifyContent: 'center' }}
      >
        <Loader />
      </CommonPageLayout>
    );
  }
  if (state === 'hasError') {
    const message = contents.message
      ? contents.message
      : 'An unknown error occurred!';
    return (
      <CommonPageLayout
        sxRootProps={{ alignItems: 'center', justifyContent: 'center' }}
        sxBodyProps={{ alignItems: 'center', justifyContent: 'center' }}
      >
        <Box>{message}</Box>
      </CommonPageLayout>
    );
  }
  return <CommonPageLayout {...otherProps}>{children}</CommonPageLayout>;
}

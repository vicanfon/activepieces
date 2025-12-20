import { t } from 'i18next';

import OrchestratorLogo from '@/assets/img/custom/auth/orchestrator-logo.png';
import { flagsHooks } from '@/hooks/flags-hooks';

const FullLogo = () => {
  const branding = flagsHooks.useWebsiteBranding();
  const logoUrl =
    branding.websiteName === 'Orchestrator Module'
      ? OrchestratorLogo
      : branding.logos.fullLogoUrl;

  return (
    <div className="h-[60px]">
      <img className="h-full" src={logoUrl} alt={t('logo')} />
    </div>
  );
};
FullLogo.displayName = 'FullLogo';
export { FullLogo };

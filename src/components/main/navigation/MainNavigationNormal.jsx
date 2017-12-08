'use strict';

import React from 'react';
import SectionedDropdown from 'components/semantic/SectionedDropdown';
import MenuSection from 'components/semantic/MenuSection';

import { configRoutes, mainRoutes, logoutItem, parseMenuItems, parseMenuItem } from 'routes/Routes';


const MainNavigationNormal = () => (
  <div className="item right">
    { parseMenuItems(mainRoutes, null, false) }

    <SectionedDropdown className="top right">
      <MenuSection>
        { parseMenuItems(configRoutes) }
      </MenuSection>
      <MenuSection>
        { parseMenuItem(logoutItem, logoutItem.onClick) }
      </MenuSection>
    </SectionedDropdown>
  </div>
);

export default MainNavigationNormal;

import React from 'react';
import Logo from '../assets/SLMCS_LOGO_300_trans.gif';

export function AlgoliaSvg() {
  return (
    <a href="https://slmcs.org/" aria-label="学校主页" target='_blank'>
      <img src={Logo} alt="学校主页" height={120} />
    </a>
  );
}

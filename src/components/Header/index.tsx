import { HeaderContainer } from "./styles";

import igniteLogo from '../../assets/ignite-logo.svg'
import { Scroll, Timer } from "phosphor-react";
import { NavLink } from "react-router-dom";

export function Header() {
    return (

        <HeaderContainer>
            <img src={igniteLogo} alt="" />
            <nav>
                <NavLink to="/" title="Timer" end>
                    <Timer size={24}/>
                </NavLink>
                <NavLink to="/history" title="Histórico">
                    <Scroll size={24}/>
                </NavLink>
            </nav>
        </HeaderContainer>
    )
}
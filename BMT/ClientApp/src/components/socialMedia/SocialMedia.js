import React from 'react'
import {
  CAvatar,
  CBadge,
  CDropdown,
  CDropdownDivider,
  CDropdownHeader,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
} from '@coreui/react'
import {
  cilBell,
  cilCreditCard,
  cilCommentSquare,
  cilEnvelopeOpen,
  cilFile,
  cilLockLocked,
  cilChevronBottom,
  cilSettings,
  cilTask,
  cilUser,
} from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import { useNavigate } from 'react-router-dom'
import avatar8 from './../../assets/images/avatars/8.jpg'

const SocialMedia = () => {
  const navigate = useNavigate();
  const handleLogout = () => {
    // Clear the loggedInUser cookie
    //document.cookie = 'loggedInUser=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    //document.cookie = 'storeId=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    //navigate('/');
    
  };

  return (
    <CDropdown variant="nav-item">          
      <CDropdownToggle className="py-0 text-center labelName mt-2 ml-3 RoleNameIconNav" caret={false}> 
         Social Media
        <CIcon className="stock-toggle-icon labelName RoleNameIcon" icon={cilChevronBottom} />
      </CDropdownToggle>
      <CDropdownMenu className="pt-0 MainViewToggle" placement="bottom-end Logout"> 
        <CDropdownItem href="#" className="text-left labelName" onClick={handleLogout}>          
          Whatsapp <img className="socialMediaIconHeader" src="whatsapp.png" alt="logo" />  
        </CDropdownItem>
        <CDropdownDivider />
        <CDropdownItem href="#" className="text-left labelName" onClick={handleLogout}>          
          Instagram <img className="socialMediaIconHeader" src="instagram.png" alt="logo" /> 
        </CDropdownItem>
        <CDropdownDivider />
        <CDropdownItem href="#" className="text-left labelName" onClick={handleLogout}>          
          Twitter <img className="socialMediaIconHeader" src="twitter.png" alt="logo" /> 
        </CDropdownItem>
        <CDropdownDivider />
        <CDropdownItem href="#" className="text-left labelName" onClick={handleLogout}>          
          Facebook <img className="socialMediaIconHeader" src="facebook.png" alt="logo" /> 
        </CDropdownItem>
      </CDropdownMenu>
    </CDropdown>
  )
}

export default SocialMedia

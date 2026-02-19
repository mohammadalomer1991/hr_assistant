interface NavBarItemProps {
  title: string;
  isActive?: boolean;
  onClick?: () => void;
  timestamp?: string;
}

export const NavBarItem = ({
  title,
  isActive = false,
  onClick,
  timestamp,
}: NavBarItemProps) => {
  return (
    <div
      className={`navbar-item${isActive ? ' active' : ''}`}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={e => e.key === 'Enter' && onClick?.()}
    >
      <div className="navbar-item-content">
        <span className="navbar-item-title" title={title}>
          {title}
        </span>
        {timestamp && (
          <span className="navbar-item-timestamp">{timestamp}</span>
        )}
      </div>
    </div>
  );
};

export default NavBarItem;

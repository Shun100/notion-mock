import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '../ui/dropdown-menu';
import {
  FiChevronDown,
  FiChevronRight,
  FiFile,
  FiMoreHorizontal,
  FiPlus,
  FiTrash2,
} from 'react-icons/fi';
import Item from '../SideBar/Item';
import type { Note } from '../../modules/notes/note.entity';
import { useState } from 'react';

type Props = {
  note: Note;
  onClick: () => void;
  onCreate?: (event: React.MouseEvent) => void;
  onExpand?: (evnet: React.MouseEvent) => void;
  onDelete?: (event: React.MouseEvent) => void;
  layer?: number;
  isExpanded?: boolean;
}

/*
 * ノート1つ1つのコンポーネント
 */
export default function NoteItem({
  note,
  onClick,
  onCreate,
  onExpand,
  onDelete,
  layer = 0,
  isExpanded = false,
}: Props) {
  const [isHovered, setIsHovered] = useState(false);

  // アコーディオンアイコンにマウスが乗ったら、ノートアイコンに変化させる
  const getIcon = () => {
    if (isExpanded) {
      return FiChevronDown;
    } else if (isHovered) {
      return FiChevronRight
    } else {
      return FiFile;
    }
  }

  const menu = (
    <div className='note-item-menu-container'>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <div className='note-item-menu-button' role='button'>
            <FiMoreHorizontal className='note-item-menu-icon' size={16} />
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className='note-item-dropdown'
          align='start'
          side='right'
          forceMount
        >
          <DropdownMenuItem onClick={onDelete}>
            <FiTrash2 className='note-item-delete-icon' size={16} />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* + ボタン */}
      <div className='note-item-menu-button' role='button' onClick={onCreate}>
        <FiPlus className='note-item-menu-icon' size={16} />
      </div>
    </div>
  );

  return (
    <div
      role='button'
      style={{ paddingLeft: `${12 * (layer + 1)}px`}}
      onMouseEnter={() => setIsHovered(true)} /* onMouseEnter: マウスホバーを検出 */
      onMouseLeave={() => setIsHovered(false)} /* onMouseLeave: マウスホバー解除を検出 */
      onClick={onClick}
    >
      <Item label={note.title ?? '無題'}
      icon={getIcon()}
      onIconClick={onExpand}
      trailingItem={menu} />
    </div>
  );
}

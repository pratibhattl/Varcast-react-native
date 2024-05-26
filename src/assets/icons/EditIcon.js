import * as React from 'react';
import Svg, {G, Path} from 'react-native-svg';

function EditIcon(props) {
  return (
    <Svg
      width={24}
      height={24}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}>
      <G stroke="#fff" strokeWidth={1.5}>
        <Path
          d="M20 10.8V12c0 3.771 0 5.657-1.172 6.828C17.657 20 15.771 20 12 20c-3.771 0-5.657 0-6.828-1.172C4 17.657 4 15.771 4 12c0-3.771 0-5.657 1.172-6.828C6.343 4 8.229 4 12 4h1.2"
          strokeLinecap="round"
        />
        <Path d="M15.721 5.164l.52-.519a2.202 2.202 0 113.114 3.114l-.52.52m-3.114-3.115s.065 1.103 1.038 2.076c.974.973 2.077 1.038 2.077 1.038M15.72 5.164L10.95 9.936c-.324.323-.485.485-.624.663-.164.21-.305.438-.42.678-.097.204-.169.421-.313.855L9.13 13.52m9.706-5.242l-4.772 4.772c-.323.323-.485.485-.663.624a3.67 3.67 0 01-.678.42c-.204.097-.421.169-.855.313l-1.388.463m0 0l-.899.3a.594.594 0 01-.75-.752l.299-.898m1.35 1.35l-1.35-1.35" />
      </G>
    </Svg>
  );
}

export default EditIcon;
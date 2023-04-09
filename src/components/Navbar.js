import * as React from 'react';
import {
    Box,
    Tabs,
    Tab,
    Paper,
    Container
} from '@mui/material'
import HomeIcon from '@mui/icons-material/Home';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { useState} from 'react';
import { useRouter } from 'next/router';

function LinkTab(props) {
    const router = useRouter();
    // {...props}를 통해 LinkTab의 props를 Tab컴포넌트에 바로 적용
    return (
      <Tab
        onClick={(event) => {
            event.preventDefault();
            router.push(props.href);
        }}
        {...props}
      />
    );
  }

export default function DenseAppBar() {
    const router = useRouter();
    const tabVal = router.pathname === '/image/upload' ? 1 : 0;
    const [value, setValue] = useState(tabVal);
    
    const handleChange = (event, newValue) => {
        setValue(newValue);
    };
 
    return (
        <Container maxWidth="sm" >
            <Box
                component={Paper}
                elevation={3}
            >
                <Tabs
                    value={value}
                    onChange={handleChange}
                    centered
                    variant="fullWidth"
                >
                    <LinkTab
                        icon={<HomeIcon sx={{ fontSize: 35 }} />}
                        iconPosition="top"
                        label="홈"
                        href="/main"    
                    />
                    <LinkTab
                        icon={<CloudUploadIcon sx={{ fontSize: 35 }} />}
                        iconPosition="top"
                        label="이미지 업로드"
                        href="/image/upload" 
                    />
                </Tabs>
            </Box>
        </Container>
    );
}

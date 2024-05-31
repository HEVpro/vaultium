import { fleekSdk } from '@/lib/fleek';
import lighthouse from '@lighthouse-web3/sdk'
import { type NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const formData = await request.formData();

  const file = formData.get("file");
  if (!file) {
      return NextResponse.json({ error: "No files received." }, { status: 400 });
  }

  try {
      const result = await fleekSdk.storage().uploadFile({
        file: file,
        onUploadProgress: (progress) => {
          console.info(`Uploaded: ${(progress.loadedSize/progress.totalSize) * 100}%`);
        }
      })
      if(result) {
        return NextResponse.json({ Message: "Success", status: 201, data: result });
      }
      return NextResponse.json({ Message: "Error", status: 400, data: result });
  } catch (error) {
      console.error("Error occured ", error);
      return NextResponse.json({ Message: "Failed", status: 500 });
  }
}

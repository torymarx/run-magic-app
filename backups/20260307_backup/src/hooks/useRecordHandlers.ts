

export const useRecordHandlers = (
    setEditingRecord: (record: any) => void,
    setShowManualForm: (show: boolean) => void,
    setInitialManualDate: (date: string | null) => void,
    handleImportRecords: (records: any[]) => Promise<void>,
    updateProfile: (profile: any) => Promise<void>,
    user: any,
    records: any[],
    profile: any
) => {
    const handleEditRecord = (record: any) => {
        setEditingRecord(record);
        setShowManualForm(true);
    };

    const handleAddNewFromCalendar = (date: Date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const dateStr = `${year}-${month}-${day}`;
        setInitialManualDate(dateStr);
        setEditingRecord(null);
        setShowManualForm(true);
    };

    const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = async (e) => {
            try {
                const importedData = JSON.parse(e.target?.result as string);
                const recordsToImport = Array.isArray(importedData) ? importedData : importedData.records;
                const profileToImport = !Array.isArray(importedData) ? importedData.profile : null;

                if (Array.isArray(recordsToImport)) {
                    if (window.confirm(`총 ${recordsToImport.length}개의 기록${profileToImport ? " 및 프로필 정보" : ""}를 복구하시겠습니까? \n(기본 기록과 중복되지 않은 항목만 추가됩니다)`)) {
                        await handleImportRecords(recordsToImport);
                        if (profileToImport) {
                            await updateProfile(profileToImport);
                        }
                    }
                } else {
                    alert("올바르지 않은 백업 파일 형식입니다.");
                }
            } catch (err) {
                alert("파일을 읽는 중 오류가 발생했습니다.");
            }
        };
        reader.readAsText(file);
    };

    const handleExport = () => {
        if (!user?.id) {
            alert("로그인 후 백업이 가능합니다. 🫡");
            return;
        }
        const exportPackage = {
            records,
            profile,
            exportedAt: new Date().toISOString(),
            version: "12.0"
        };
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportPackage, null, 2));
        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", `run_magic_backup_${user?.email?.split('@')[0]}_${new Date().toISOString().split('T')[0]}.json`);
        document.body.appendChild(downloadAnchorNode);
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
    };

    return {
        handleEditRecord,
        handleAddNewFromCalendar,
        handleImport,
        handleExport
    };
};

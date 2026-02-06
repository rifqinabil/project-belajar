class nama:
    def __init__(self, nama, umur):
        self.nama = nama
        self.umur = umur   

    def perkenalan(self):
        print("Halo, nama saya " + self.nama + " dan saya berumur " + str(self.umur) + " tahun")   

orang1 = nama("Andi", 25)
orang1.perkenalan() 

print("\n")

orang2 = nama("Budi", 30)
orang2.perkenalan()